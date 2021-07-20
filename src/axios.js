import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://web.api.pointsoftango.app/'
})

export default instance
