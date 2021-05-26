import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://dev.api.pointsoftango.app/'
})

export default instance
