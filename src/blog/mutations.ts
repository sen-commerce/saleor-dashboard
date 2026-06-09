import { gql } from "@apollo/client";

export const blogPostCreateMutation = gql`
  mutation BlogPostCreate($input: BlogPostInput!) {
    blogPostCreate(input: $input) {
      blogPost {
        id
        title
        slug
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const blogPostUpdateMutation = gql`
  mutation BlogPostUpdate($id: ID!, $input: BlogPostInput!) {
    blogPostUpdate(id: $id, input: $input) {
      blogPost {
        id
        title
        slug
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const blogPostDeleteMutation = gql`
  mutation BlogPostDelete($id: ID!) {
    blogPostDelete(id: $id) {
      blogPost {
        id
        title
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const blogCategoryCreateMutation = gql`
  mutation BlogCategoryCreate($input: BlogCategoryInput!) {
    blogCategoryCreate(input: $input) {
      blogCategory {
        id
        name
        slug
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const blogAuthorCreateMutation = gql`
  mutation BlogAuthorCreate($input: BlogAuthorInput!) {
    blogAuthorCreate(input: $input) {
      blogAuthor {
        id
        name
        slug
      }
      errors {
        field
        message
        code
      }
    }
  }
`;
