import axios from 'axios'

export default ({ req }) => { 
    if (typeof window === "undefined") {
        //we are on servcer
        //requests should be mad to http://SERVICENAME.NAMESPACE.svc.cluster.local
        return axios.create({
            baseURL: "wwww.tanatorn.com",
            headers: req.headers
        })
      } else {
        //we on the browser!
        //request can be made with base url of ''
        return axios.create({
            baseURL: '/'
        })
      }
}
