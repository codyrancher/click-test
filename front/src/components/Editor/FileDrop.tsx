import { useState } from 'react';
import './FileDrop.scss';

export interface FileDropProps {
    onChange: (value: File) => void;
    value: File | null;
};

export default function FileDrop(props: FileDropProps) {
    const [hover, setHover] = useState<boolean>();
    const [imgSrc, setImgSrc] = useState<string>();

    const image = props.value ? <img src={imgSrc} id="preview" alt="lame"/> : null;
    const label = props.value ? null : <label>Drag and Drop Screenshot</label>;

    if (props.value) {
        const reader = new FileReader();

        reader.onload = (e) => {
            if (e?.target?.result) {
                setImgSrc(e.target.result as string);
            }
        };

        reader.readAsDataURL(props.value);
    }

    const className = [
        'file-drop',
        hover ? 'hover' : null
    ]
    .filter(c => c)
    .join(' ');

    const wrap = (fn: (ev?: any) => void) => {
        return (ev: any) => {
            ev.preventDefault();
            ev.stopPropagation();
            fn(ev);
        };
    };
    const onDragEnter = wrap(() => setHover(true));
    const onDragLeave = wrap(() => setHover(false));
    const onDrop = wrap((ev) => {
        if (ev.dataTransfer.items) {
            if (ev.dataTransfer.items.length > 1) {
                alert('only 1 file at a time');
              return;
            }
          // Use DataTransferItemList interface to access the file(s)
          for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
              var file = ev.dataTransfer.items[i].getAsFile();
              console.log('... file[' + i + '].name = ' + file.name);
              props.onChange(file);
            }
          }
        }
    });
    const onDragOver = wrap(() => {});

    const drop = props.value
        ? null
        : <div className="drop" onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop} onDragOver={onDragOver}>
            {label}
        </div>;

    return (<div className={className} >
        {image}
        {drop}
    </div>);
}