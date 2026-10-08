import imageFragment from "./image";
import seoFragment from "./seo";

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    docsUrl: metafield(namespace: "nautic", key: "docs_url") {
      value
    }
    firmwareUrl: metafield(namespace: "nautic", key: "firmware_url") {
      value
    }
    complianceUrl: metafield(namespace: "nautic", key: "compliance_url") {
      value
    }
    installGuideUrl: metafield(namespace: "nautic", key: "install_guide_url") {
      value
    }
    warrantySummary: metafield(namespace: "nautic", key: "warranty_summary") {
      value
    }
    fccSummary: metafield(namespace: "nautic", key: "fcc_summary") {
      value
    }
    hatlabsSku: metafield(namespace: "nautic", key: "hatlabs_sku") {
      value
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
