import moreImage from '../public/image/More.png'

const getServerImage = (src: string | undefined): string => {
    if(!src) return moreImage.src
    return "https://wn-server.herokuapp.com/" + src
}

export default getServerImage
