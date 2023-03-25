import sitePreview from "../assets/lundahl-site.png";
import Thumbnail from "react-webpage-thumbnail";

const SitePreview = () => {
  return (
    <div className="flex w-screen h-screen place-content-center">
      <h1>Is this your site?</h1>
      <Thumbnail
        url="https://lundahlironworks.com/"
        width={800}
        height={800}
        iframeHeight={1920}
        iframeWidth={1080}
      />
    </div>
  );
};

export default SitePreview;
