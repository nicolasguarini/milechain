export default function Footer() {
  return (
    <footer className="shadow m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="md:flex md:items-center md:justify-between">
          <a
            href="https://milechain.com/"
            className="flex items-center mb-4 md:mb-0 justify-center"
          >
            <img
              src="/milechain.png"
              className="h-8 mr-3"
              alt="MileChain Logo"
            />
          </a>
          <ul className="flex flex-row items-center mb-6 text-sm font-medium sm:mb-0 justify-center">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-center">
          © 2023{" "}
          <a href="https://milechain.com/" className="hover:underline">
            MileChain™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
