import { FormLayoutResponsiveStep } from "@vaadin/react-components";

type ResponsiveStep = {
    minWidth: string;
    columns: number;
};
  
export const formResponsive: FormLayoutResponsiveStep[] = [
    { minWidth: '0px', columns: 1 },
    { minWidth: '640px', columns: 2 },
    { minWidth: '1024px', columns: 3 },
    { minWidth: '1280px', columns: 4 },
];
  