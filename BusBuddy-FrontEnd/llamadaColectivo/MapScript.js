const key = process.env.NEXT_PUBLIC_API_KEY;
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
script.async = true;
script.defer = true;

export default script;