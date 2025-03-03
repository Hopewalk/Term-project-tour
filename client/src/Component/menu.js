import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuItem,
} from "@headlessui/react";
import logotour from "../Images/logotour.png";

const navigation = [
  { name: "Home", href: "/Home" },
  { name: "One day trip", href: "/Onedaytrip" },
  { name: "Trip & Rest", href: "/Trip&Rest" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuUnden() {
  return (
    <Disclosure as="nav" className="bg-[#0e5484]">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <a href="/Home" className="flex shrink-0 items-center">
              <img alt="Logo" src={logotour} className="h-12 w-auto" />
            </a>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-100 hover:bg-gray-400 hover:text-white",
                      "rounded-md px-4 py-3 text-base font-medium"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Login button */}
            <Menu as="div">
              <MenuItem>
                <a
                  href="/Login"
                  className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  เข้าสู่ระบบ
                </a>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-400 text-white"
                  : "text-gray-100 hover:bg-gray-400 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
