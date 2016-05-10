import * as React from 'react';

interface Props extends React.Props<any> {
    ahead: number;
    behind: number;
    max?: number;
}

export const BehindAheadGraph = (props: Props) => {
    const ahead = props.ahead ? props.ahead : 0;
    const behind = props.behind ? props.behind : 0;
    const max = props.max ? props.max : 100;
    
    let behindWidth = (behind / max) * 100;
    let aheadWidth = (ahead / max) * 100;
    behindWidth = behindWidth > 100 ? 100 : behindWidth;
    aheadWidth = aheadWidth > 100 ? 100 : aheadWidth;
    
    return (
        <div className='behind-ahead-graph'>
            <div className='count-graph behind-graph empty-count'>
                <div className='count-bar' style={{width: `${behindWidth}%`}}></div>
                <div className='count'>{behind}</div>
            </div>
            <div className='count-graph ahead-graph'>
                <div className='count-bar' style={{width: `${aheadWidth}%`}}></div>
                <div className='count'>{ahead}</div>
            </div>
        </div>
    );
};