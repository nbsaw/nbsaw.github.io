import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { githubApi } from '../../api';
import SiteTitle from '../../elements/SiteTitle';
import removeMd from 'remove-markdown';
import PostTitle from '../TagsPage/components/PostTitle';
import { Link } from 'react-router-dom';
import LabelTitle from '../TagsPage/components/LabelTitle';
import { getPixivList } from '../../api/pixiv';

const Container = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
`;

const Block = styled.div`
  font-size: 12px;
  display: flex;
  flex-shrink: 0;
  /* height: 400px; */
  padding: 50px 25px;
  border: 1px solid #ece8e8;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
  &:nth-child(1n) {
    margin-right: 20px;
  }
`;

const BlockText = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
`;

const BlockLabelTitle = styled.div`
  display: inline-block;
  & + & {
    margin-left: 5px;
  }
`;

const BlockImage = styled.div<{ src: string }>`
  width: 300px;
  height: 250px;
  flex-shrink: 0;
  margin-left: 15px;
  ${({ src }) =>
    css`
      background: url(${src});
      background-repeat: no-repeat;
      background-position: 50% 50%;
    `}
`;

const BlockReadMore = styled(Link)`
  width: 100%;
`;

const PostAt = styled.div`
  margin-bottom: 15px;
`;

class PostsPage extends Component<{}, { resultList: any[] }> {
  state = {
    loading: true,
    resultList: []
  };

  async componentDidMount() {
    if (localStorage.getItem('v')) {
      // TODO: temp code
      const i = await getPixivList();
      const v = localStorage.getItem('v') || '';
      const r = JSON.parse(v);
      r.forEach((_: string, idx: number) => (r[idx].img = i[idx]));
      if (r.length > 50) {
        for (let idx = 50; idx < r.length; idx++)
          r[idx].img = `https://picsum.photos/500/300?number=${idx}`;
      }
      this.setState({ resultList: r });
    } else {
      let resultList = await githubApi.issues.getAll();
      localStorage.setItem('v', JSON.stringify(resultList));
      this.setState({ resultList });
    }
  }

  render() {
    return (
      <Container>
        <SiteTitle>Blog</SiteTitle>
        {this.state.resultList.map(
          (
            {
              updated_at,
              title,
              number,
              body,
              img,
              ...args
            }: {
              updated_at: string;
              title: string;
              number: string;
              body: string;
              labels: any;
              img: string;
            },
            idx
          ) => {
            const plainText = removeMd(body);
            return (
              <Block key={number}>
                <BlockText>
                  <div>
                    <PostTitle number={number} title={title} />
                    <PostAt>发布于 {updated_at.slice(0, 10)}</PostAt>
                    {args.labels.map((item: any, idx: number) => (
                      <BlockLabelTitle>
                        <LabelTitle
                          name={item.name}
                          color={`#${item.color}`}
                          key={idx}
                        ></LabelTitle>
                      </BlockLabelTitle>
                    ))}
                  </div>
                  <p>{`${plainText.slice(0, 120)} ...`}</p>
                </BlockText>
                <div>
                  <BlockImage src={img} />
                </div>
                <BlockReadMore to={`post/${number}`}>
                  Read More ...
                </BlockReadMore>
              </Block>
            );
          }
        )}
      </Container>
    );
  }
}

export default PostsPage;
