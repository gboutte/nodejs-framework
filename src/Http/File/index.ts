import * as fs from 'fs';
import * as path from 'path';
import { Magic, MAGIC_MIME } from 'mmmagic';

class File {
  private path: string;
  private mime: string;
  constructor(path: string) {
    this.path = path;
    this.mime = '';
    if (fs.lstatSync(path).isFile()) {
      try {
        fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
        let magic = new Magic(MAGIC_MIME);

        magic.detectFile(this.path, (err, result) => {
          if (err) throw err;
          this.mime = result.toString();
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  public getMime() {
    return this.mime;
  }

  public getPath() {
    return this.path;
  }
  public getFilename() {
    return path.basename(this.path);
  }
  public getExt() {
    return path.extname(this.path);
  }
  public move(directory: string, filename: string | null) {
    let file = filename !== null ? filename : this.getFilename();
    fs.renameSync(this.path, path.join(directory, file))
  }
  public copy(directory: string, filename: string | null) {
    let file = filename !== null ? filename : this.getFilename();
    fs.copyFileSync(this.path, path.join(directory, file));
  }

}

export { File }