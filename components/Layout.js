import NavRespon from "./navigation/NavRespon"
import Cabezera from "./header/Cabezera"

const Layout = ({ children}) => {
    return (

<>

              <NavRespon />   
                <Cabezera />   
        <div className="content">    
             { children }
        </div>
        
        <style jsx>{`
        
         .content {
            margin: auto ;
		width: 100%;
		max-width: calc(100% - 0.4rem);
		color: white;
		font-size: 20px;
		line-height: 1.6;
	} 
  `}</style>
    
</>
    );
}
export default Layout;