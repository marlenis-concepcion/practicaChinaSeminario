import { BadRequestException, Controller, Get, NotFoundException, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { promisify } from 'node:util';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { GENERATED_OUTPUT_DIRECTORY } from './output.config';

const run = promisify(execFile);
const temporaryDirectory = join(GENERATED_OUTPUT_DIRECTORY, '.temporary');
interface UploadedLocalFile { path: string; originalname: string }

@Controller()
export class AppController {
  @Get('health')
  health() {
    return { status: 'ok', application: 'APP-Semininario-Dos', localVideo: true, avatarProviderConfigured: Boolean(process.env.AVATAR_PROVIDER_API_KEY) };
  }

  @Post('videos/local')
  @UseInterceptors(FileFieldsInterceptor(
    [{ name: 'photo', maxCount: 1 }, { name: 'audio', maxCount: 1 }],
    {
      storage: diskStorage({
        destination: (_request, _file, callback) => { mkdirSync(temporaryDirectory, { recursive: true }); callback(null, temporaryDirectory); },
        filename: (_request, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${extname(file.originalname).slice(0, 10)}`),
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    },
  ))
  async createLocalVideo(@UploadedFiles() files: { photo?: UploadedLocalFile[]; audio?: UploadedLocalFile[] }) {
    const photo = files.photo?.[0];
    const audio = files.audio?.[0];
    if (!photo || !audio) throw new BadRequestException('A photo and an audio recording are required.');
    const fileName = `teacher-presentation-${Date.now()}.mp4`;
    const outputPath = join(GENERATED_OUTPUT_DIRECTORY, fileName);
    try {
      await run('ffmpeg', [
        '-y', '-loop', '1', '-framerate', '30', '-i', photo.path, '-i', audio.path,
        '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=white,format=yuv420p',
        '-c:v', 'libx264', '-preset', 'medium', '-tune', 'stillimage', '-c:a', 'aac', '-b:a', '192k',
        '-shortest', '-movflags', '+faststart', outputPath,
      ], { maxBuffer: 10 * 1024 * 1024 });
      return { fileName, downloadUrl: `/generated/${fileName}`, mode: 'local-original-audio' };
    } finally {
      for (const file of [photo.path, audio.path]) if (existsSync(file)) unlinkSync(file);
    }
  }

  @Get('generated/:fileName')
  download(@Param('fileName') requestedName: string, @Res() response: Response) {
    const fileName = basename(requestedName);
    if (fileName !== requestedName || !fileName.endsWith('.mp4')) throw new BadRequestException('Invalid file name.');
    const filePath = join(GENERATED_OUTPUT_DIRECTORY, fileName);
    if (!existsSync(filePath)) throw new NotFoundException('Generated video not found.');
    return response.sendFile(filePath);
  }
}
