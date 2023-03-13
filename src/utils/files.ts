import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

export const deleteFile = (path: string) => {
  if (existsSync(join('upload', path))) {
    unlinkSync(join('upload', path))
    return 0
  } else return 1
}
