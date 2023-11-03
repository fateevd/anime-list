import LoginForm from '../components/login';
import img from '../components/248bbb0be2ed5ebf4d20436f7d0a04e29a7703aa.webp'
import InnerAlert from "@/app/components/InnerAlert";

export default function Page() {
  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full relative" style={{backgroundImage: `url("${img.src}")`, opacity: '.25'}}/>
      <InnerAlert>
        <LoginForm/>
      </InnerAlert>
    </div>
  );
};


