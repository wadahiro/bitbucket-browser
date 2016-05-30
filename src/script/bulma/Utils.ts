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

export type ClassName = ModifiersProps | ActiveProps | TitleProps | ButtonSyntaxProps;

export function calcClassNames(props: ClassName = {}) {
    const classNames: string[] = [];

    handleButtonProps(classNames, props);
    handleTitleProps(classNames, props);
    handleActiveProps(classNames, props);
    handleModifiersProps(classNames, props);

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
