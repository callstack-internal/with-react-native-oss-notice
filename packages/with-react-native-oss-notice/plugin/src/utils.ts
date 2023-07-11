import { exec } from 'child_process'

export async function invokeCommand(command: string) {
  return new Promise<void>((resolve, reject) => {
    exec(command, function (err, stdout, stderr) {
      if (err) {
        console.warn(stderr)
        reject(err)
        return
      }

      if (stderr) {
        console.warn(stderr)
      }

      if (stdout) {
        console.log(stdout)
      }

      resolve()
    })
  })
}
