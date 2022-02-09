<div class="parag ccenter">
    <h2>Welcome</h2>
    This site has been created for the second project of 
    <a href="https://newton.fis.agh.edu.pl/~antek/index.php?sub=it" target="_blank">Internet Technologies</a>.
</div>
<div class="parag ccenter">
    <h2>Task content</h2>
    <blockquote>
        Aplikacja WWW przetwarzająca dane w trybie on-line i off-line.
        <br><br>
        <h3>Założenia projektu:</h3>
        <br>
        <h4>Zawartość merytoryczna projektu:<br></h4>
        W ramach projektu należy opracować prostą aplikację działająca po stronie przeglądarki w trybie on-line i off-line.<br>
        W trybie off-line (bez połączenia z serwisem) możliwe jest zapisanie danych do lokalnej bazy danych dostępnej w przeglądarce.
        Dostępna jest również możliwość przeglądania zgromadzonych danych w systemie lokalnym przeglądarki.<br>
        W trybie on-line (połączenie z serwerem) następuje przesłanie danych klienta do serwisu (dane lokalne po zapisaniu w serwisie są usuwane).
        Przesłanie danych może być zrealizowane automatycznie - po połączeniu z serwerem aplikacja sama prześle dane lub ręcznie - wymuszone przez użytkownika.
        W trybie on-line istnieje możliwość wprowadzania danych do bazy oraz ich przeglądania.<br>
        Wprowadzane dane są walidowane po stronie przeglądarki z wykorzystaniem języka Javascript oraz przez aplikację po stronie serwera.
        Połączenie z serwerem następuje po uwierzytelnieniu.
        Wprowadzane dane powinny zawierać indeks - pole jednoznacznie identyfikujące wprowadzony rekord.
        Opracowany program w trybie on-line (połączenie z serwisem) powinniem posiadać możliwość analizy danych.<br><br>
        <h4>Przykładowe tematy aplikacji<br></h4>
        Prosty program do zbierania danych ankietowych, prosty system do rejestracji danych medycznych, pogodowych, wyników sportowych, obecności na zajęciach.
        Przykładowa identyfikacja danych: dla ankiet: numer ankiety i data; dla danych medycznych - data i godzina; dla danych pogodowych - miejsce, data i godzina;
        dla wyników sportowych - zdarzenie, data. Analiza danych to przykładowo histogram czy wykres zależny od czasu.<br><br>
        <h4>Wykorzystane technologie<br></h4>
        Języki programistyczne do wykorzystania po stronie serwera: php, perl lub python a po stronie przeglądarki HTML5 i JavaScript.
        Technologie zastosowane w projekcie: dostęp do baz danych: server (perl, php - SQLite lub BerkeleyDB, MongoDB), przeglądarka (Indexeddb).
        W ramach projektu należy wykorzystać szablony (projekt własny, XML & XSL). Dostęp do serwisu poprzez logowanie, należy wykorzystać sesje.<br><br>
        <h4>Połączenie pomiędzy klientem a serwerem WWW.<br></h4>
        Do wyboru: najprościej HTTP POST, technologia AJAX, RESTful lub WebService.<br><br>

        <h3>Ocena za projekt (maximum):<br></h3>
        1) Podstawowa funkcjonalność - 20 pkt.<br>
        2) Warstwa abstrakcji w dostępie do źródeł danych po stronie serwera - 5 pkt.<br>
        3) Wykorzystanie technologii RESTful lub WebService - 5 pkt.<br>
    </blockquote>
</div>

<div class="parag">
    <h2 class="ccenter">Technologies used</h2><br>
    <h3>Node.js Server</h3>
    The server has been created in Node.js with support of Express.js.
    <br><br>
    <h3>Session</h3>
    The user session is realized with the "express-session" module.
    <br><br>
    <h3>HTML + CSS</h3>
    Both HTML and CSS files pass W3C validation.
    <br><br>
    <h3>HTML Templates</h3>
    The project uses templates in order to achieve site content modularity while sacrificing diminishing amounts of loading time.
    <br><br>
    <h3>Server Database</h3>
    The server database is realized using the SQLite3 module.
    <br><br>
    <h3>Local Database</h3>
    The local database is managed by IndexedDB technology which is implemented in the web browser.
    <br><br>
    <h3>REST API</h3>
    The site provides raw REST API to the server database to authorized users.
    This way, additional components and functionality can be added without compromising the already implemented features.
    <br><br>
    The site UI also makes use of REST for accessibility to all users.
</div>

<div class="parag">
    The site has been tested on Pop!_OS 21.10 (x86_64; KDE) system with Opera 77.0.4054.172 and Mozilla Firefox 95.0.1.
</div>
