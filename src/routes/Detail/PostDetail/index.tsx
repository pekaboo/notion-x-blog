import React, { useMemo } from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"


type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()

  const category = data?.category?.[0]
  const type0 = data?.type?.[0]
  const recordMapBlock = data?.recordMap?.block as any

  // 提取第一个 code block 内容（仅 type=HTML/FullHTML 时，且仅渲染为页面，不显示源代码）
  const firstHtmlCode = useMemo(() => {
    if (!type0 || !["HTML", "FullHTML"].includes(type0) || !recordMapBlock)
      return null
    const blocks = Object.values(recordMapBlock)
    // 找到第一个 code block
  const codeBlock: any = blocks.find((b: any) => b?.value?.type === "code")
    if (!codeBlock) return null;
    // 获取 code 内容
    const code = codeBlock.value?.properties?.title?.[0]?.[0] || "";
    return code;
  }, [type0, recordMapBlock]);

  // 仅保留 code 中的页面主体内容：
  // - 移除 <style>/<script>/<link> 等标签
  // - 若包含 <body> 则仅取 <body> 内部内容
  const sanitizedHtml = useMemo(() => { 
    return firstHtmlCode
  }, [firstHtmlCode])

  // type=FullHTML 时，整个页面只渲染 HTML 内容
  if (type0 === "FullHTML" && sanitizedHtml) {
    // 整页渲染，仅输出代码内容的 HTML，不带任何额外外框/头部
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
  }

  if (!data) return null

  return (
    <StyledWrapper>
      <article>
        {category && (
          <CategoryWrapper>
            <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
              {category}
            </Category>
          </CategoryWrapper>
        )}
        {data.type[0] === "Post" && <PostHeader data={data} />}
        <div>
          {type0 === "HTML" && sanitizedHtml && (
            <HtmlPreviewWrapper>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            </HtmlPreviewWrapper>
          )}
          <NotionRenderer recordMap={data.recordMap} />
          
        </div>
        {data.type[0] === "Post" && (
          <>
            <Footer />
            <CommentBox data={data} />
          </>
        )}
      </article>
    </StyledWrapper>
  )
}

export default PostDetail

const StyledWrapper = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  max-width: 56rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  > article {
    margin: 0 auto;
    max-width: 42rem;
  }
`

const CategoryWrapper = styled.div`
  margin-bottom: 0.5rem;
`

const HtmlPreviewWrapper = styled.div`
  margin-bottom: 24px;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 16px;
  background: #fafbfc;
  overflow-x: auto;
`
