public static async Task<string> KookWater(int ml) {
    Console.WriteLine("Water koken...");
    await Task.Delay(5 * ml);
    Console.WriteLine("Water gekookt!");
    return "heet water";
}
public static async Task<string> KiesZakje() {
    Console.WriteLine("Zakje kiezen...");
    await Task.Delay(100);
    Console.WriteLine("Zakje gekozen!");
    return "groene thee";
}
public static async Task<string> MaakThee(string water, string zakje) {
    Console.WriteLine("Maak thee...");
    await Task.Delay(10);
    Console.WriteLine("Thee gemaakt!");
    return water + " met " + zakje;
}
public static async Task<string> HaalBroodBijAH() {
    Console.WriteLine("Broodjes halen...");
    await Task.Delay(2000);
    Console.WriteLine("Broodjes gehaald!");
    return "brood";
}
public static async Task<string> MaakJam(string soort) {
    Console.WriteLine("Jam maken...");
    await Task.Delay(1000);
    Console.WriteLine("Jam gemaakt");
    return soort + "jam";
}
public static async Task<string> SnijBrood(string brood) {
    Console.WriteLine("Brood snijden...");
    await Task.Delay(500);
    Console.WriteLine("Brood gesneden");
    return "gesneden " + brood;
}
public static async Task<string> SmeerBrood(string brood, string jam) {
    Console.WriteLine("Brood smeren...");
    await Task.Delay(500);
    Console.WriteLine("Brood gesmeerd...");
    return brood + " met " + jam;
}
public static async Task<string> ServeerOntbijt(string drinken, string eten) {
    Console.WriteLine("Ontbijt serveren...");
    await Task.Delay(100);
    Console.WriteLine("Ontbijt geserveerd");
    return "U kunt " + drinken + " drinken en u kunt " + eten + " eten";

static void Main(string[] args){
    Task.Run(async () => await Main2(args)).GetAwaiter().GetResult();
}
static async Task Main2(string[] args){
    Task<string> water = KookWater(200);
    Task<string> theeZakje = KiesZakje();
    Task<string> thee = MaakThee(await water, await theeZakje);
    Task<string> brood = HaalBroodBijAH();
    Task<string> jam = MaakJam("appels"); 
    Task<string> boterham = SnijBrood(await brood);
    Task<string> gesmeerdeBoterham = SmeerBrood(await boterham, await jam);
    Console.WriteLine(ServeerOntbijt(await thee, await gesmeerdeBoterham));
    Console.ReadLine();
}
 
