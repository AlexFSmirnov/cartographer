export const downloadFile = (filename: string, content: string) => {
    const linkElement = document.createElement('a');

    linkElement.setAttribute(
        'href',
        `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
    );
    linkElement.setAttribute('download', filename);

    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);

    linkElement.click();

    document.body.removeChild(linkElement);
};
