import fs from 'fs/promises';
import path from 'path';

export async function copyDir(srcDir: string, destDir: string) {
  try {
    await fs.mkdir(destDir, { recursive: true }); // 确保目标目录存在

    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      const entryStats = await fs.lstat(srcPath);

      if (entryStats.isDirectory()) {
        // 递归复制目录
        await copyDir(srcPath, destPath);
      } else if (entryStats.isSymbolicLink()) {
        // 解引用软链接，并递归复制内容
        const realSrcPath = await fs.realpath(srcPath);
        const realSrcStats = await fs.lstat(realSrcPath);
        if (realSrcStats.isDirectory()) {
          // 复制目录内容
          await copyDir(realSrcPath, destPath);
        } else {
          // 复制文件内容
          const data = await fs.readFile(realSrcPath);
          await fs.writeFile(destPath, data);
        }
      } else {
        // 复制文件
        const data = await fs.readFile(srcPath);
        await fs.writeFile(destPath, data);
      }
    }
  } catch (error) {
    console.error(`Error occurred while copying directory: ${error}`);
    throw error;
  }
}
