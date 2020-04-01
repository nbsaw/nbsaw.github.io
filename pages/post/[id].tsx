import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { githubApi } from "../../services";
import { useState, useEffect } from "react";
import SiteTitle from "../../components/site-title";
import style from "./index.module.scss";
import DefaultLayoutRouter from "../../layout/default";
import TimeAgo from "./components/time-ago";

const md = MarkdownIt();

const RenderPostById = function(props) {
  const {
    post_content,
    post_title,
    post_created_at,
    post_updated_at,
    post_url,
    error
  } = props;
  const [postContent, setPostContent] = useState("");
  const [dom, setDom] = useState<HTMLDivElement>();
  const [isMounted, setIsMounted] = useState(false);

  // check is mounted
  useEffect(() => setIsMounted(true), []);

  // init post content
  useEffect(() => {
    if (isMounted && post_content) {
      const dom = document.createElement("div");
      dom.innerHTML = md.render(post_content);
      setDom(dom);
    }
  }, [isMounted, post_content]);

  // hightlight code
  useEffect(() => {
    if (isMounted && dom?.innerHTML) {
      Array.from(dom.getElementsByTagName("pre")).forEach(elm =>
        hljs.highlightBlock(elm)
      );
      setPostContent(dom.innerHTML);
    }
  }, [isMounted, dom]);

  if (error) return error.message;
  return (
    isMounted && (
      <DefaultLayoutRouter isPost>
        <div className={style.post}>
          <div className={style.content}>
            <SiteTitle>{post_title}</SiteTitle>
            <h2 className={style.title}>
              {post_title}
              <TimeAgo
                created_at={post_created_at}
                updated_at={post_updated_at}
              />
            </h2>
            <p dangerouslySetInnerHTML={{ __html: postContent }} />
          </div>
        </div>
      </DefaultLayoutRouter>
    )
  );
};

RenderPostById.getInitialProps = async res => {
  const { id } = res.query;
  try {
    const result = await githubApi.issues.getDetails({ number: id });
    return {
      post_content: result.body,
      post_title: result.title,
      post_created_at: result.created_at,
      post_updated_at: result.updated_at,
      post_url: result.url
    };
  } catch (e) {
    // this.props.history.replace("/404");
    return {
      error: e
    };
  }
};

export default RenderPostById;
