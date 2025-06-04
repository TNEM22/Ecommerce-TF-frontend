import Components from "./Components";
import Price from "./Price";

const SideBar = ({ handlePrice }) => {
  return (
    <>
      <section className="h-fit sticky left-0 top-24 border-slate-200 border-r-2 w-[200px] hidden items-center flex-col pl-8 pr-2 md:flex">
        <Components name={"sidebar-components"} />
        <Price name={"sidebar-price"} handlePrice={handlePrice} />
      </section>
    </>
  );
};

export default SideBar;
