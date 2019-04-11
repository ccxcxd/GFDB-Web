import axios from 'axios'

export const getDB = () => {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'GET',
      url: `${PUBLIC_PATH}static/${DB_FILE_NAME}.json`,
    }
    console.log(config)
    axios(config).then(resp => {
      if (resp.status === 200) {
        resolve({
          success: true,
          data: resp.data
        })
      }
    }).catch(err => {
      console.log('error')
      console.log(err)
      resolve({
        success: false,
        data: err.message,
      })
    })
  })
}