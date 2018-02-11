const config = require('./config.json')

const download = require('image-downloader')

const tools = new (require('./Tools'))()

const path = require('path')
const fs = require('fs-extra')

module.exports = class IOTools {
  getImagePath (filePath) {
    const finalPath = path.join('./images', filePath)

    return new Promise((resolve, reject) => {
      if (this.getFileSize(finalPath) < 8000000) {
        resolve(finalPath)
      } else reject(new Error('Provided file is too large to send over Discord.'))
    })
  }

  async downloadImage (options) {
    try {
      const { filename, image } = await download.image(options)

      return Promise.resolve({ filename, image })
    } catch (err) {
      return Promise.reject(err)
    }
  }

  getRandomImage (dirPath, args) {
    return new Promise((resolve, reject) => {
      this.getImageFilenames(dirPath).then(filenames => {
        if (args === undefined || isNaN(args[0])) resolve(filenames[tools.getRandom(0, filenames.length)])
        else resolve(filenames[args[0]])
      }).catch(err => reject(err))
    })
  }

  getImage (filename) {
    return new Promise((resolve, reject) => {
      const finalPath = path.join(__dirname, '../images', filename)

      if (fs.existsSync(finalPath)) {
        if (this.getFileSize(finalPath) < 8000000) {
          resolve(finalPath)
        } else reject(new Error('The requested file is too large to display. (> 8mb)'))
      } else reject(new Error('The requested file does not exist.'))
    })
  }

  getFileSize (filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
  }

  getImageFilenames (dirPath) {
    const finalDir = path.join('./images', dirPath)
    let filePaths = []

    return new Promise((resolve, reject) => {
      fs.readdir(finalDir).then(filenames => {
        for (let x = 0; x < filenames.length; x++) {
          let finalPath = path.join(finalDir, filenames[x])

          if (this.getFileSize(finalPath) < 8000000) filePaths.push(finalPath)
        }

        resolve(filePaths)
      }).catch(err => reject(err))
    })
  }

  async readDataFile (filename) {
    return fs.readFile(path.join(__dirname, '../data', filename), 'utf-8')
  }

  async readFile (filePath) {
    return fs.readFile(filePath, 'utf-8')
  }

  async readRelativeFile (filePath) {
    return fs.readFile(path.join(__dirname, filePath), 'utf-8')
  }

  readFileSync (filePath) {
    return fs.readFileSync(filePath)
  }

  async fileExists (filePath) {
    return fs.exists(filePath)
  }

  async removeFile (filePath) {
    fs.exists(filePath).then(exists => {
      return fs.remove(filePath)
    })
  }
}
