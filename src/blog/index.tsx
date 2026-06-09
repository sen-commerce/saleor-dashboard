import { Route } from "@dashboard/components/Router";
import { Switch } from "react-router-dom";

import BlogPostCreate from "./views/BlogPostCreate";
import BlogPostDetails from "./views/BlogPostDetails";
import BlogPostList from "./views/BlogPostList";

export const BlogSection = () => {
  return (
    <Switch>
      <Route exact path="/blog" component={BlogPostList} />
      <Route exact path="/blog/add" component={BlogPostCreate} />
      <Route path="/blog/:id" component={BlogPostDetails} />
    </Switch>
  );
};

export default BlogSection;
