import { Button, Dialog, Paper } from "@mui/material"
import React from "react"
import ImageEditor from "react-avatar-editor"

interface ChopImageProps {
    open: boolean
    onClose: (val: boolean) => void
    image: any
    submit: any
}

const ChopImage: React.FC<ChopImageProps> = (props: any) => {
    const { onClose, open, image, submit } = props

    const [data, setData] = React.useState(null)

    const ref = React.useRef() as React.LegacyRef<ImageEditor>
    // console.log(ref.current)

    const handleSubmit = async () => {
        const url = ref?.current.getImageScaledToCanvas().toDataURL()
        const mimeType = (url.match(/^data:([^;]+);/) || "")[1]
        const image = await fetch(url)
            .then(function (res) {
                return res.arrayBuffer()
            })
            .then(function (buf) {
                return new File([buf], "image.png", { type: mimeType })
            })
        submit(url, image)
    }

    return (
        <Dialog
            open={open}
            onClose={() => {
                onClose(false)
                // setSearchType("novels")
            }}
        >
            <ImageEditor ref={ref} image={image} width={250} height={370} />
            <Button variant="contained" onClick={() => handleSubmit()}>Сохранить</Button>
        </Dialog>
    )
}

export default ChopImage
