import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { SvgIcon, SvgIconProps } from "@mui/material"
import { makeStyles } from "@mui/styles"
// import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon"
// import makeStyles from "@material-ui/styles/makeStyles"
import React, { forwardRef } from "react"

type Props = Omit<SvgIconProps, "viewBox"> & {
    icon: IconDefinition
}

const useStyles = makeStyles({
    root: {},
    colorSecondary: {},
    colorAction: {},
    colorDisabled: {},
    colorError: {},
    colorPrimary: {},
    fontSizeInherit: {},
    fontSizeSmall: {},
    fontSizeLarge: {},
    pathPrimary: {},
    pathSecondary: {
        opacity: 0.4,
    },
})

const FontAwesomeMuiIcon = forwardRef<SVGSVGElement, Props>((props, ref) => {
    const {
        icon: {
            icon: [width, height, , , svgPathData],
        },
        classes,
        ...svgIconProps
    } = props

    const { pathPrimary: pathPrimaryClassName, pathSecondary: pathSecondaryClassName, ...svgIconClasses } = useStyles(props)

    return (
        <SvgIcon ref={ref} {...svgIconProps} classes={svgIconClasses} viewBox={`0 0 ${width} ${height}`}>
            {typeof svgPathData === "string" ? (
                <path d={svgPathData} />
            ) : (
                svgPathData.map((d, i) => <path key={d} className={i === 0 ? pathSecondaryClassName : pathPrimaryClassName} d={d} />)
            )}
        </SvgIcon>
    )
})

FontAwesomeMuiIcon.displayName = "FontAwesomeMuiIcon"
export default FontAwesomeMuiIcon
