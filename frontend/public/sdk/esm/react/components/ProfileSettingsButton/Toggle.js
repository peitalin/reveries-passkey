import { j as jsxRuntimeExports } from '../../node_modules/.pnpm/react@18.3.1/node_modules/react/jsx-runtime.js';

// Color constants for easy customization
const TOGGLE_COLORS = {
    activeBackground: '#62a57e', // green-600
    activeShadow: 'rgba(22, 163, 74, 0.3)', // green-600 with opacity
    inactiveBackground: '#d1d5db', // gray-300
    inactiveShadow: 'rgba(0, 0, 0, 0.1)',
};
const Toggle = ({ checked, onChange, tooltip, label = "", showTooltip = true, className = '', size = 'small', textPosition = 'left', colors }) => {
    const isLarge = size === 'large';
    const isTextOnLeft = textPosition === 'left';
    // Merge custom colors with defaults
    const toggleColors = {
        activeBackground: colors?.activeBackground ?? TOGGLE_COLORS.activeBackground,
        activeShadow: colors?.activeShadow ?? TOGGLE_COLORS.activeShadow,
        inactiveBackground: colors?.inactiveBackground ?? TOGGLE_COLORS.inactiveBackground,
        inactiveShadow: colors?.inactiveShadow ?? TOGGLE_COLORS.inactiveShadow,
    };
    return (jsxRuntimeExports.jsxs("div", { className: `${className}`, children: [!showTooltip && (jsxRuntimeExports.jsx("style", { children: `
            .toggle-label.no-tooltip::after,
            .toggle-label.no-tooltip::before {
              display: none !important;
            }
          ` })), jsxRuntimeExports.jsxs("label", { className: `toggle-label ${!showTooltip || !tooltip ? 'no-tooltip' : ''}`, ...(tooltip && showTooltip && { 'data-tooltip': tooltip }), style: {
                    position: 'relative',
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontWeight: '500',
                    color: '#333333',
                    flexDirection: isTextOnLeft ? 'row-reverse' : 'row',
                    ...(isLarge && {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    })
                }, children: [jsxRuntimeExports.jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), className: "toggle-checkbox", style: {
                            opacity: 0,
                            position: 'absolute',
                            width: 0,
                            height: 0
                        } }), jsxRuntimeExports.jsx("span", { style: {
                            position: 'relative',
                            display: 'inline-block',
                            width: isLarge ? '44px' : '32px',
                            height: isLarge ? '24px' : '16px',
                            backgroundColor: checked ? toggleColors.activeBackground : toggleColors.inactiveBackground,
                            borderRadius: isLarge ? '12px' : '8px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            transform: checked ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: checked ? `0 2px 8px ${toggleColors.activeShadow}` : `0 1px 3px ${toggleColors.inactiveShadow}`,
                            ...(isLarge && {
                                [isTextOnLeft ? 'marginLeft' : 'marginRight']: '12px'
                            })
                        }, children: jsxRuntimeExports.jsx("span", { style: {
                                position: 'absolute',
                                content: '""',
                                height: isLarge ? '18px' : '12px',
                                width: isLarge ? '18px' : '12px',
                                left: isLarge ? '3px' : '2px',
                                bottom: isLarge ? '3px' : '2px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                transform: checked
                                    ? `translateX(${isLarge ? '20px' : '15px'}) scale(1.1)`
                                    : 'translateX(0px) scale(1)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: checked
                                    ? '0 3px 12px rgba(0, 0, 0, 0.3)'
                                    : '0 1px 2px rgba(0, 0, 0, 0.2)'
                            } }) }), jsxRuntimeExports.jsx("span", { className: "toggle-text", style: {
                            fontWeight: '500',
                            fontSize: isLarge ? '14px' : '0.8rem',
                            color: '#333333',
                            [isTextOnLeft ? 'marginRight' : 'marginLeft']: isLarge ? '0' : '8px',
                            display: 'flex',
                            alignItems: 'center',
                            height: isLarge ? '24px' : '16px',
                            lineHeight: 1
                        }, children: label })] })] }));
};

export { Toggle, Toggle as default };
//# sourceMappingURL=Toggle.js.map
