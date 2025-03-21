import React, { useContext } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { AuthContext } from "../../context/Auth.context";
import logotour from "../../Images/logotour.png";
import { UserOutlined } from "@ant-design/icons";

export default function MenuUser() {
  const {
    state: { isLoggedIn },
    logout,
  } = useContext(AuthContext);

  const MenuLink = ({ item, className }) => (
    <a
      key={item.name}
      href={item.href}
      aria-current={item.current ? "page" : undefined}
      className={className}
    >
      {item.name}
    </a>
  );

  const navigation = [
    { name: "Home", href: "/Home" },
    { name: "One day trip", href: "/Onedaytrip" },
    { name: "Trip & Rest", href: "/Trip&Rest" },
  ];
  const menuItems = [
    { name: "โปรไฟล์", href: "/Profile" },
    { name: "สถานะการจอง", href: "/History" },
  ];

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
                  <MenuLink
                    key={item.name}
                    item={item}
                    className={`rounded-md px-4 py-3 text-sm font-medium ${
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-100 hover:bg-gray-400 hover:text-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="size-7 relative flex rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-100 items-center">
                  <UserOutlined className="absolute left-[0.4rem] size-7" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5"
              >
                {menuItems.map((item) => (
                  <MenuItem key={item.name}>
                    <a
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      {item.name}
                    </a>
                  </MenuItem>
                ))}
                {isLoggedIn && (
                  <MenuItem>
                    <a
                      href="/Home"
                      onClick={logout}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      ออกจากระบบ
                    </a>
                  </MenuItem>
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              as="a"
              key={item.name}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-100 hover:bg-gray-400 hover:text-white"
              }`}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
