import styles from "./UploadButton.module.scss"

import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileUpload, faPlus } from "@fortawesome/free-solid-svg-icons"
import { IconButton, Paper, Typography } from "@mui/material"
import React from "react"
import MoreImage from "../../../../public/image/More.png"
import { Delete as DeleteIcon, PhotoCamera as PhotoCameraIcon } from "@mui/icons-material"
import { Controller, useFormContext } from "react-hook-form"

interface UploadButtonProps {
    accept?: string | undefined
    name: string
}

const UploadButton: React.FC<UploadButtonProps> = (props) => {
    const { accept, name } = props
    const { register, formState, control, setValue } = useFormContext()

    const [preview, setPreview] = React.useState("")
    const [hover, setHover] = React.useState(false)

    const OnUploadImage = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setPreview(URL.createObjectURL(e.target.files[0]))
            setValue(name, e.target.files[0])
        }
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
        <Paper className={styles.button} elevation={6} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {hover && (
                <div className={styles.button__delete}>
                    <IconButton color="error" className={styles.button__delete_button} onClick={() => setPreview("")}>
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
        </Paper>
    )
}

export default UploadButton
