/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["d3exjxhq0acftn.cloudfront.net","medrepo-bucket.s3.ap-south-1.amazonaws.com"],
      },
      //this should be removed
      eslint: {
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
