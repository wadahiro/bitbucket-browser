export interface ModifiersProps extends SyntaxProps, HelpersProps {
}

export interface ButtonSyntaxProps extends SyntaxProps {
    isInverted?: boolean;

    isLink?: boolean;
}

export interface SyntaxProps {
    isPrimary?: boolean;
    isInfo?: boolean;
    isSuccess?: boolean;
    isWarning?: boolean;
    isDanger?: boolean;

    isSmall?: boolean;
    isMedium?: boolean;
    isLarge?: boolean;

    isOutlined?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
}

export interface HelpersProps {
    isClearfix?: boolean;
    isPulledLeft?: boolean;
    isPulledRight?: boolean;

    isOverlay?: boolean;

    isFullwidth?: boolean;

    hasTextCentered?: boolean;
    hasTextLeft?: boolean;
    hasTextRight?: boolean;

    isDisabled?: boolean;
    isMarginless?: boolean;
    isUnselectable?: boolean;
}

export interface ActiveProps {
    isActive?: boolean;
}

export interface TitleProps {
    isTitle?: boolean;
    isTitle1?: boolean;
    isTitle2?: boolean;
    isTitle3?: boolean;
    isTitle4?: boolean;
    isTitle5?: boolean;
    isTitle6?: boolean;

    isSubtitle?: boolean;
    isSubtitle1?: boolean;
    isSubtitle2?: boolean;
    isSubtitle3?: boolean;
    isSubtitle4?: boolean;
    isSubtitle5?: boolean;
    isSubtitle6?: boolean;
}

export interface ColumnsTypeProps {
    isMobile?: boolean;
    isDesktop?: boolean;
    isMultiline?: boolean;
    isGapless?: boolean;
}

export interface ColumnTypeProps {
    isThreeQuarters?: boolean;
    isTwoThirds?: boolean;
    isHalf?: boolean;
    isOneThird?: boolean;
    isOneQuarter?: boolean;

    isThreeQuartersMobile?: boolean;
    isTwoThirdsMobile?: boolean;
    isHalfMobile?: boolean;
    isOneThirdMobile?: boolean;
    isOneQuarterMobile?: boolean;

    isThreeQuartersTablet?: boolean;
    isTwoThirdsTablet?: boolean;
    isHalfTablet?: boolean;
    isOneThirdTablet?: boolean;
    isOneQuarterTablet?: boolean;

    isThreeQuartersDesktop?: boolean;
    isTwoThirdsDesktop?: boolean;
    isHalfDesktop?: boolean;
    isOneThirdDesktop?: boolean;
    isOneQuarterDesktop?: boolean;

    isOffsetThreeQuarters?: boolean;
    isOffsetTwoThirds?: boolean;
    isOffsetHalf?: boolean;
    isOffsetOneThird?: boolean;
    isOffsetOneQuarter?: boolean;

    is2?: boolean;
    is3?: boolean;
    is4?: boolean;
    is5?: boolean;
    is6?: boolean;
    is7?: boolean;
    is8?: boolean;
    is9?: boolean;
    is10?: boolean;
    is11?: boolean;

    isOffset1?: boolean;
    isOffset2?: boolean;
    isOffset3?: boolean;
    isOffset4?: boolean;
    isOffset5?: boolean;
    isOffset6?: boolean;
    isOffset7?: boolean;
    isOffset8?: boolean;
    isOffset9?: boolean;
    isOffset10?: boolean;
    isOffset11?: boolean;

    isNarrow?: boolean;
    isNarrowMobile?: boolean;
    isNarrowTablet?: boolean;
    isNarrowDesktop?: boolean;
}

export type ClassName = ModifiersProps | ActiveProps | TitleProps | ButtonSyntaxProps;
export type GridClassName = ColumnsTypeProps | ColumnTypeProps;

export function calcClassNames(props: ClassName = {}) {
    const classNames: string[] = [];

    handleButtonProps(classNames, props);
    handleTitleProps(classNames, props);
    handleActiveProps(classNames, props);
    handleModifiersProps(classNames, props);

    return classNames.join(' ');
}

export function calcGridClassNames(props: GridClassName = {}) {
    const classNames: string[] = [];

    handleColumnsTypeProps(classNames, props);
    handleColumnTypeProps(classNames, props);

    return classNames.join(' ');
}


function handleButtonProps(classNames: string[], props: ButtonSyntaxProps) {
    if (props.isInverted) {
        classNames.push('is-inverted');
    }

    if (props.isLink) {
        classNames.push('is-link');
    }
}

function handleTitleProps(classNames: string[], props: TitleProps) {
    if (props.isTitle) {
        classNames.push('title');
    }

    if (props.isTitle1) {
        classNames.push('title is-1');
    } else if (props.isTitle2) {
        classNames.push('title is-2');
    } else if (props.isTitle3) {
        classNames.push('title is-3');
    } else if (props.isTitle4) {
        classNames.push('title is-4');
    } else if (props.isTitle5) {
        classNames.push('title is-5');
    } else if (props.isTitle6) {
        classNames.push('title is-6');
    }

    if (props.isSubtitle) {
        classNames.push('subtitle');
    }

    if (props.isSubtitle1) {
        classNames.push('subtitle is-1');
    } else if (props.isSubtitle2) {
        classNames.push('subtitle is-2');
    } else if (props.isSubtitle3) {
        classNames.push('subtitle is-3');
    } else if (props.isSubtitle4) {
        classNames.push('subtitle is-4');
    } else if (props.isSubtitle5) {
        classNames.push('subtitle is-5');
    } else if (props.isSubtitle6) {
        classNames.push('subtitle is-6');
    }
}

function handleActiveProps(classNames: string[], props: ActiveProps) {
    if (props.isActive) {
        classNames.push('is-active');
    }
}

function handleModifiersProps(classNames: string[], props: ModifiersProps) {
    if (props.isPrimary) {
        classNames.push('is-primary');
    } else if (props.isInfo) {
        classNames.push('is-info');
    } else if (props.isSuccess) {
        classNames.push('is-success');
    } else if (props.isWarning) {
        classNames.push('is-warning');
    } else if (props.isDanger) {
        classNames.push('is-danger');
    }

    if (props.isSmall) {
        classNames.push('is-small');
    } else if (props.isMedium) {
        classNames.push('is-medium');
    } else if (props.isLarge) {
        classNames.push('is-large');
    }

    if (props.isOutlined) {
        classNames.push('is-outlined');
    } else if (props.isLoading) {
        classNames.push('is-loading');
    } else if (props.isDisabled) {
        classNames.push('is-disabled');
    }

    if (props.isClearfix) {
        classNames.push('is-clearfix');
    } else if (props.isPulledLeft) {
        classNames.push('is-pulled-left');
    } else if (props.isPulledRight) {
        classNames.push('is-pulled-right');
    }

    if (props.isOverlay) {
        classNames.push('is-overlay');
    }

    if (props.isFullwidth) {
        classNames.push('is-fullwidth');
    }

    if (props.hasTextCentered) {
        classNames.push('has-text-centered');
    } else if (props.hasTextLeft) {
        classNames.push('has-text-left');
    } else if (props.hasTextRight) {
        classNames.push('has-text-right');
    }

    if (props.isMarginless) {
        classNames.push('is-marginless');
    } else if (props.isUnselectable) {
        classNames.push('isUnselectable');
    }
}

function handleColumnsTypeProps(classNames: string[], props: ColumnsTypeProps) {
    if (props.isMobile) {
        classNames.push('is-mobile');
    } else if (props.isDesktop) {
        classNames.push('is-desktop');
    }

    if (props.isMultiline) {
        classNames.push('is-multiline');
    }

    if (props.isGapless) {
        classNames.push('is-gapless');
    }
}

function handleColumnTypeProps(classNames: string[], props: ColumnTypeProps) {
    if (props.isThreeQuarters) {
        classNames.push('is-three-quarters');
    } else if (props.isTwoThirds) {
        classNames.push('is-two-thirds');
    } else if (props.isHalf) {
        classNames.push('is-half');
    } else if (props.isOneThird) {
        classNames.push('is-one-third');
    } else if (props.isOneQuarter) {
        classNames.push('is-one-quarter');
    }

    if (props.isThreeQuartersMobile) {
        classNames.push('is-three-quarters-mobile');
    } else if (props.isTwoThirdsMobile) {
        classNames.push('is-two-thirds-mobile');
    } else if (props.isHalfMobile) {
        classNames.push('is-half-mobile');
    } else if (props.isOneThirdMobile) {
        classNames.push('is-one-third-mobile');
    } else if (props.isOneQuarterMobile) {
        classNames.push('is-one-quarter-mobile');
    }

    if (props.isThreeQuartersTablet) {
        classNames.push('is-three-quarters-tablet');
    } else if (props.isTwoThirdsTablet) {
        classNames.push('is-two-thirds-tablet');
    } else if (props.isHalfTablet) {
        classNames.push('is-half-tablet');
    } else if (props.isOneThirdTablet) {
        classNames.push('is-one-third-tablet');
    } else if (props.isOneQuarterTablet) {
        classNames.push('is-one-quarter-tablet');
    }

    if (props.isThreeQuartersDesktop) {
        classNames.push('is-three-quarters-desktop');
    } else if (props.isTwoThirdsDesktop) {
        classNames.push('is-two-thirds-desktop');
    } else if (props.isHalfDesktop) {
        classNames.push('is-half-desktop');
    } else if (props.isOneThirdDesktop) {
        classNames.push('is-one-third-desktop');
    } else if (props.isOneQuarterDesktop) {
        classNames.push('is-one-quarter-desktop');
    }

    if (props.isOffsetThreeQuarters) {
        classNames.push('is-offset-three-quarters');
    } else if (props.isOffsetTwoThirds) {
        classNames.push('is-offset-two-thirds');
    } else if (props.isOffsetHalf) {
        classNames.push('is-offset-half');
    } else if (props.isOffsetOneThird) {
        classNames.push('is-offset-one-third');
    } else if (props.isOffsetOneQuarter) {
        classNames.push('is-offset-one-quarter');
    }

    if (props.is2) {
        classNames.push('is-2');
    } else if (props.is3) {
        classNames.push('is-3');
    } else if (props.is4) {
        classNames.push('is-4');
    } else if (props.is5) {
        classNames.push('is-5');
    } else if (props.is6) {
        classNames.push('is-6');
    } else if (props.is7) {
        classNames.push('is-7');
    } else if (props.is8) {
        classNames.push('is-8');
    } else if (props.is9) {
        classNames.push('is-9');
    } else if (props.is10) {
        classNames.push('is-10');
    } else if (props.is10) {
        classNames.push('is-11');
    }

    if (props.isOffset2) {
        classNames.push('is-offset-2');
    } else if (props.isOffset3) {
        classNames.push('is-offset-3');
    } else if (props.isOffset4) {
        classNames.push('is-offset-4');
    } else if (props.isOffset5) {
        classNames.push('is-offset-5');
    } else if (props.isOffset6) {
        classNames.push('is-offset-6');
    } else if (props.isOffset7) {
        classNames.push('is-offset-7');
    } else if (props.isOffset8) {
        classNames.push('is-offset-8');
    } else if (props.isOffset9) {
        classNames.push('is-offset-9');
    } else if (props.isOffset10) {
        classNames.push('is-offset-10');
    } else if (props.isOffset10) {
        classNames.push('is-offset-11');
    }

    if (props.isNarrow) {
        classNames.push('is-narrow');
    } else if (props.isNarrowMobile) {
        classNames.push('is-narrow-mobile');
    } else if (props.isNarrowTablet) {
        classNames.push('is-narrow-tablet');
    } else if (props.isNarrowDesktop) {
        classNames.push('is-narrow-desktop');
    }
}