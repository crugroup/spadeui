export const spadeTitleHandler = ({
    resource,
    action,
    params
}: {
    resource: any,
    action: any,
    params: any
}) => {
    let title = "Spade";
  
    if (resource && action) {
      title = `${resource} ${action} ${params.id} | ${title}`;
    }
  
    return title;
  };