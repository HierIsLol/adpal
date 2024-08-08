const HomePage: React.FC<{ user: any; signOut: () => void }> = ({ user, signOut }) => {
  const [firstName, setFirstName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const API_URL = 'https://p82pqtgrs0.execute-api.us-east-1.amazonaws.com/prod/getUserInfo';
        const urlWithParams = `${API_URL}?username=${encodeURIComponent(user.username)}`;
        console.log("Request URL:", urlWithParams);

        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseBody = await response.json();
        console.log("Response status:", response.status);
        console.log("Response body:", responseBody);

        if (response.status === 200 && responseBody.success) {
          const userInfo = JSON.parse(responseBody.body);
          if (userInfo && userInfo.user_info && userInfo.user_info.firstName) {
            setFirstName(userInfo.user_info.firstName);
            console.log("First name set to:", userInfo.user_info.firstName);
          } else {
            setErrorMessage('Gebruikersinformatie niet gevonden');
          }
        } else {
          setErrorMessage(responseBody.message || 'Er is een fout opgetreden');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setErrorMessage('Fout bij het ophalen van gebruikersinformatie');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [user.username]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <img 
        src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" 
        style={{ width: '188px', height: '188px', margin: '0 auto', display: 'block' }} 
        alt="AdPal Logo"
      />
      <h1 style={{ marginTop: '20px' }}>
        {isLoading ? "Laden..." : errorMessage ? errorMessage : `Welkom ${firstName}`}
      </h1>
      <p>We zijn nog druk bezig, je kunt alvast je store koppelen of het dashboard bekijken 😁</p>
      {/* Rest van de component blijft hetzelfde */}
    </div>
  );
};
