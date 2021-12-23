import styles from "./UploadButton.module.scss"

import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileUpload, faPlus } from "@fortawesome/free-solid-svg-icons"
import { IconButton, Paper, Typography } from "@mui/material"
import React from "react"
import MoreImage from "../../../../public/image/More.png"
import { Delete as DeleteIcon, PhotoCamera as PhotoCameraIcon } from "@mui/icons-material"
import { Controller, useFormContext } from "react-hook-form"
import ChopImage from "../../../modal/chopImage"

interface UploadButtonProps {
    accept?: string | undefined
    name: string
}

const UploadButton: React.FC<UploadButtonProps> = (props) => {
    const { accept, name } = props
    const { register, formState, control, setValue } = useFormContext()

    const [openChop, setOpenChop] = React.useState(false)
    const [imageChop, setImageChop] = React.useState("")

    const [preview, setPreview] = React.useState("")
    const [hover, setHover] = React.useState(false)

    const OnUploadImage = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setImageChop(URL.createObjectURL(e.target.files[0]))
            setOpenChop(true)
        }
    }

    const handleReceiveImage = (val: any, file: File) => {
        setPreview(val)
        setValue(name, file)
        setOpenChop(false)
    }

    const onMouseEnter = () => {
        if (!preview) return
        setHover(true)
    }
    const onMouseLeave = () => {
        if (!preview) return
        setHover(false)
    }

    return (
        <Paper className={styles.button} elevation={6} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ width: "100%", height: "100%" }}>
            {hover && (
                <div className={styles.button__delete}>
                    <IconButton
                        color="error"
                        className={styles.button__delete_button}
                        onClick={() => {
                            setPreview("")
                            setHover(false)
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            {preview ? (
                <Image layout="responsive" width={375} height={556} src={preview} className={styles.button__preview} alt="" />
            ) : (
                <span className={styles.button__center}>
                    {/* <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                            <input {...field} type="file" name={name} accept={accept} className={styles.button__upload} onChange={(e) => OnUploadImage(e)} />
                        )}
                    /> */}

                    <input {...register(name)} type="file" name={name} accept={accept} className={styles.button__upload} onChange={(e) => OnUploadImage(e)} />

                    {/* {<img src={MoreImage.src} className={styles.button__preview} alt="" />} */}
                    <div>
                        {/* <FontAwesomeIcon icon={faFileUpload} className={styles.button__icon} /> */}
                        <PhotoCameraIcon />
                        <Typography sx={{ mt: 3 }}>{accept}</Typography>
                    </div>
                </span>
            )}
            <ChopImage open={openChop} onClose={setOpenChop} image={imageChop} submit={handleReceiveImage} />
        </Paper>
    )
}

export default UploadButton
