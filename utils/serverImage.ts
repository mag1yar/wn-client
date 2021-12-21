import moreImage from '../public/image/More.png'

const getServerImage = (src: string | undefined): string => {
    if(!src) return moreImage.src
    return "http://localhost:3001/" + src
}

export default getServerImage
