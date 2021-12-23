import moreImage from '../public/image/More.png'

const getServerImage = (src: string | undefined): string => {
    if(!src) return moreImage.src
    return `${process.env.NEXT_PUBLIC_BACKEND}/` + src
}

export default getServerImage
