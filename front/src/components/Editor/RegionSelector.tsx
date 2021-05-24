import './RegionSelector.scss';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { useRef, useState } from 'react';

export interface Region {
    start?: [number, number],
    end?: [number, number]
}

export interface ClickEvent {
    position: [number, number];
    type: 'success' | 'failure';
}

export interface RegionSelectorProps {
    onChange: (value: Region[]) => void;
    value?: Region[];
    onClick?: (event: ClickEvent) => void;
    clicks?: ClickEvent[];
    hideRegion?: boolean;
};

export default function RegionSelector(props: RegionSelectorProps) {
    const element = useRef(null);
    const [drawing, setDrawing] = useState<boolean>(false);

    const getMousePosition = (ev: any): any => {
        const e: any = element.current;
        const parentRect = e.getBoundingClientRect();
        const x = ev.clientX - parentRect.left;
        const y = ev.clientY - parentRect.top;
    
        return [x, y];
    };

    const onMouseDown = (ev: any) => {
        props.onChange([...(props.value || []), {
            start: getMousePosition(ev),
            end: getMousePosition(ev)
        }]);

        setDrawing(true);
    };

    const onMouseUp = (ev: any) => {
        if (!drawing) {
            return;
        }

        const newRegions = [...(props.value || [])];
        if (newRegions.length === 0) {
            return;
        }

        const start = newRegions[newRegions.length - 1].start;
        newRegions.splice(-1, 1, {
            start,
            end: getMousePosition(ev)
        });
        props.onChange(newRegions);

        setDrawing(false);
    };

    const onMouseMove = (ev: any) => {
        if (!drawing) {
            return;
        }

        const newRegions = [...(props.value || [])];
        if (newRegions.length === 0) {
            return;
        }

        const start = newRegions[newRegions.length - 1].start;
        newRegions.splice(-1, 1, {
            start,
            end: getMousePosition(ev)
        });
        props.onChange(newRegions);
    };

    const getSides = (region: Region) => {
        if (!region?.start || !region?.end) {
            return;
        }

        const left = region.start[0] < region.end[0] ? region.start[0] : region.end[0];
        const right = region.start[0] < region.end[0] ? region.end[0] : region.start[0];
    
        const top = region.start[1] < region.end[1] ? region.start[1] : region.end[1];
        const bottom = region.start[1] < region.end[1] ? region.end[1] : region.start[1];
    
        return {left, right, top, bottom};
    };

    const onClick = (success: boolean) => {
        return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.preventDefault();
            event.stopPropagation();

            if (!props.onClick || event.type === 'contextmenu') {
                return;
            }

            props.onClick({
                position: getMousePosition(event),
                type: success ? 'success' : 'failure'
            });
        };
    };

    const isDefined = (n: any) => {
        return typeof n !== 'undefined' && n !== null;
    }
 
    const getRegionStyle = (region: Region):CSSProperties | undefined => {
        const sides = getSides(region);
        if (!sides || !isDefined(sides?.left) || !isDefined(sides?.right) || !isDefined(sides?.top) || !isDefined(sides?.bottom)) {
            return;
        }

        return {
            left: sides.left,
            top: sides.top,
            width: sides.right - sides.left,
            height: sides.bottom - sides.top,
            opacity: props.hideRegion ? 0 : 1
        };
    }

    const removeRegion = (index: number) => {
        return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const newRegions = [...(props.value || [])];

            event.stopPropagation();
            event.preventDefault();
            newRegions.splice(index, 1);
            console.log('spl', index);
            props.onChange(newRegions);
        };
    };

    const prevent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const regionElements = (props.value || [])
        .filter(region => region)
        .map((region, i) => <div key={i} className="region" style={getRegionStyle(region)} onClick={onClick(true)} onContextMenu={removeRegion(i)} onMouseDown={prevent} onMouseMove={prevent}></div>);

    const styler = (clickEvent: ClickEvent): CSSProperties => {
        return {
            left: clickEvent.position[0] - 7.5,
            top: clickEvent.position[1] - 7.5,
        };
    }

    const clicks = (props.clicks || []).map((click, i) => <div key={i} className={`click ${click.type}`} style={styler(click)}></div>)

    return (<div ref={element} className="region-selector" onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove} onClick={onClick(false)}>
        {regionElements}
        {clicks}
    </div>);
}