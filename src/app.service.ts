import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getInfo(): string {
    return 'This is Nest Mongoose template'
  }
}
