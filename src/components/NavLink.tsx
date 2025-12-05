import { NavLink as RouterNavLink } from "react-router-dom";
import type { NavLinkProps } from "react-router-dom";

export type Props = NavLinkProps & { children: React.ReactNode };

const NavLink = (props: Props) => {
  return <RouterNavLink {...props} />;
};

export default NavLink;
