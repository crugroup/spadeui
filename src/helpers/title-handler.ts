export const spadeTitleHandler = ({ resource, action, params }: { resource: any; action: any; params: any }) => {
  let title = "Spade";

  if (!resource || !action) {
    return title;
  }

  const capitalizedResource = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
  const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);

  if (!params.id) {
    title = `${capitalizedResource} / ${capitalizedAction} / ${title}`;
  } else {
    title = `${capitalizedResource} / ${capitalizedAction} / ${params.id} | ${title}`;
  }

  return title;
};
