import { gql } from "@apollo/client";

export const blogPostListQuery = gql`
  query BlogPostList($first: Int, $after: String, $last: Int, $before: String) {
    blogPosts(before: $before, after: $after, first: $first, last: $last) {
      edges {
        node {
          id
          title
          slug
          readingTimeMinutes
          createdAt
          isPublished
          publishedAt
          author {
            id
            name
          }
          category {
            id
            name
          }
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

export const blogPostDetailsQuery = gql`
  query BlogPostDetails($id: ID!) {
    blogPost(id: $id) {
      id
      title
      slug
      content
      featuredComments
      featuredImage
      readingTimeMinutes
      createdAt
      updatedAt
      isPublished
      publishedAt
      author {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

export const blogCategoryListQuery = gql`
  query BlogCategoryList($first: Int, $after: String) {
    blogCategories(first: $first, after: $after) {
      edges {
        node {
          id
          name
          slug
          description
        }
      }
    }
  }
`;

export const blogAuthorListQuery = gql`
  query BlogAuthorList($first: Int, $after: String) {
    blogAuthors(first: $first, after: $after) {
      edges {
        node {
          id
          name
          slug
          bio
          avatarUrl
        }
      }
    }
  }
`;
