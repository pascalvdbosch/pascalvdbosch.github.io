using System;

namespace myfirstapp
{
    public class Player
    {
        public int x;

        public Player()
        {
            x = Console.WindowWidth / 2;
        }

        public void left()
        {
            x = Math.Max(0, x - 1);
        }

        public void right()
        {
            x = Math.Min(Console.WindowWidth, x + 1);
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Player player = new Player();
            Console.Clear();
            Console.CursorVisible = false;
            while (true)
            {
                Console.SetCursorPosition(player.x, Console.WindowHeight);
                Console.Write("P");
                System.Threading.Thread.Sleep(100);
                Console.SetCursorPosition(player.x, Console.WindowHeight);
                Console.Write(" ");
                if (Console.KeyAvailable)
                {
                    ConsoleKey key = Console.ReadKey(true).Key;
                    if (key.Equals(ConsoleKey.J))
                    {
                        player.left();
                    }
                    if (key.Equals(ConsoleKey.K))
                    {
                        player.right();
                    }
                }

            }
        }
    }
}