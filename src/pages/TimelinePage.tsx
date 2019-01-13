import React, { Component } from 'react';
import { Timeline } from 'antd';
import SiteTitle from '../elements/SiteTitle';
import styled from 'styled-components';

import { timeline } from '../constant';

const Time = styled.h1`
  font-weight: 300;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaecef;
`;

const MeTimeline = styled<any>(Timeline)`
  .ant-timeline-item-last {
    padding-bottom: 0;
  }
`;

class RenderTimeLine extends Component {
  render() {
    const years = Object.keys(timeline);
    const timelineComponents = years
      .map(year => (
        <MeTimeline key={year}>
          <Time>{year}</Time>
          {timeline[year].map((item, idx) => (
            <Timeline.Item key={idx} color={item.color} dot={item.dot}>
              {item.text}
            </Timeline.Item>
          ))}
        </MeTimeline>
      ))
      .reverse();
    return timelineComponents;
  }
}

class TimeLinePage extends Component {
  render() {
    return (
      <React.Fragment>
        <SiteTitle>时间轴</SiteTitle>
        <RenderTimeLine />
      </React.Fragment>
    );
  }
}

export default TimeLinePage;
