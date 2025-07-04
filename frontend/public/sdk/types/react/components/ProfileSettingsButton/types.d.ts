import type { ToggleColorProps } from './Toggle';
export interface ProfileDimensions {
    width: number;
    height: number;
}
export interface ProfileAnimationConfig {
    duration: number;
    delay: number;
    ease: string;
}
export interface ProfileMenuItem {
    icon: React.ReactNode;
    label: string;
    description: string;
    disabled: boolean;
    onClick?: () => void;
}
export interface ProfileButtonProps {
    username: string;
    nearAccountId?: string;
    onLogout: () => void;
    toggleColors?: ToggleColorProps;
}
export interface ProfileTriggerProps {
    username: string;
    isOpen: boolean;
    onClick: () => void;
    isHovered?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}
export interface ProfileDropdownProps {
    isOpen: boolean;
    menuItems: ProfileMenuItem[];
    useRelayer: boolean;
    onRelayerChange: (value: boolean) => void;
    onLogout: () => void;
    onClose: () => void;
    toggleColors?: ToggleColorProps;
}
export interface ProfileMenuItemProps {
    item: ProfileMenuItem;
    index: number;
    onClose: () => void;
}
export interface ProfileLogoutSectionProps {
    onLogout: () => void;
}
export interface ProfileRelayerToggleSectionProps {
    useRelayer: boolean;
    onRelayerChange: (value: boolean) => void;
    toggleColors?: ToggleColorProps;
}
export interface ProfileStateRefs {
    buttonRef: React.RefObject<HTMLDivElement>;
    dropdownRef: React.RefObject<HTMLDivElement>;
    menuItemsRef: React.MutableRefObject<(HTMLElement | null)[]>;
}
export interface ProfileCalculationParams {
    accountName: string;
    numMenuItems: number;
    profileButtonHeight: number;
    menuItemHeight: number;
    toggleSectionHeight: number;
    logoutSectionHeight: number;
    bottomBuffer: number;
}
export type { ToggleColorProps };
//# sourceMappingURL=types.d.ts.map