import { File, Folder } from "tabler-icons-react";

export const mockFlappyBird = [
  {
    label: "Welcome",
    icon: File,
    link: "/courses/flappy-bird/welcome",
  },
  {
    label: "Introduction",
    icon: Folder,
    links: [
      {
        label: "Introduction",
        link: "/courses/flappy-bird/introduction/01-introduction",
      },
      {
        label: "Prerequisites",
        link: "/courses/flappy-bird/introduction/02-prerequisites",
      },
      {
        label: "MDX Post",
        link: "/courses/flappy-bird/introduction/mdx-post",
      },
    ],
  },
  {
    label: "Project Setup",
    icon: Folder,
    links: [
      { label: "Getting Started", link: "/" },
      { label: "Setting up the Canvas", link: "/" },
      { label: "Releases schedule", link: "/" },
    ],
  },
  {
    label: "Scrolling Scene",
    icon: Folder,
    links: [
      { label: "Preface", link: "/" },
      { label: "Loading the Sprite Sheet", link: "/" },
      { label: "Drawing the Background", link: "/" },
      { label: "Drawing the Ground", link: "/" },
      { label: "Scrolling the Ground", link: "/" },
      { label: "Delta Time", link: "/" },
    ],
  },
  {
    label: "Adding the Bird",
    icon: Folder,
    links: [
      { label: "Preface", link: "/" },
      { label: "Drawing the Bird", link: "/" },
      { label: "Add Flap Animation", link: "/" },
      { label: "Flap On Click", link: "/" },
      { label: "Bird State", link: "/" },
      { label: "Rotating the Bird", link: "/" },
    ],
  },
];
