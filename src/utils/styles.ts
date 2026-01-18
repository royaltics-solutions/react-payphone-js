/**
 * Injects default styles for the Payphone button if not already present.
 */
export const injectStyles = () => {
    const styleId = 'payphone-react-styles';
    if (document.getElementById(styleId)) return;

    const css = `
        .payphone-btn {
            background-color: #ff5000;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .payphone-btn:hover {
            background-color: #e04600;
        }
        .payphone-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .payphone-btn svg {
            margin-right: 8px;
            height: 20px;
            width: 20px;
        }
    `;

    const style = document.createElement('style');
    style.id = styleId;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
};
